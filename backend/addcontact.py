from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import mysql.connector
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Initialize CORS

# Database connection
def get_db_connection():
    conn = mysql.connector.connect(
        host='localhost',          # Database host
        user='root',              # Database username
        password='Sudeepa@05',    # Database password
        database='contact_manager' 
    )
    return conn 

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400

    try:
        # Insert into the database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if the email already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"message": "Email already exists!"}), 400

        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Signup successful!"}), 201
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return jsonify({"message": "Login successful!", "user": {"email": email}}), 200
        else:
            return jsonify({"message": "Invalid email or password!"}), 401
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/contacts', methods=['GET'])
def get_contacts():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, name, email, phone, location, birthday, is_favorite FROM contacts')  # Exclude photo
    contacts = cursor.fetchall()

    # Format birthday to only show date
    for contact in contacts:
        if contact['birthday']:
            contact['birthday'] = contact['birthday'].strftime('%Y-%m-%d')  # Format as YYYY-MM-DD

    cursor.close()
    conn.close()
    return jsonify(contacts)

@app.route('/add_contact', methods=['POST'])
def add_contact():
    new_contact = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(''' 
        INSERT INTO contacts (name, email, phone, location, birthday, is_favorite) 
        VALUES (%s, %s, %s, %s, %s, %s) 
    ''', (new_contact['name'], new_contact['email'], new_contact['phone'], 
          new_contact['location'], new_contact['birthday'], 
          new_contact.get('is_favorite', False)))  
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(new_contact), 201

@app.route('/contact/<int:id>', methods=['GET'])
def get_contact(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, name, email, phone, location, birthday, is_favorite FROM contacts WHERE id = %s', (id,))
    contact = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(contact)

@app.route('/edit_contact/<int:id>', methods=['PUT'])
def edit_contact(id):
    updated_contact = request.json

    # Handle and format the birthday field if it exists and is not empty
    if 'birthday' in updated_contact:
        if updated_contact['birthday']:
            try:
                # Format birthday to 'YYYY-MM-DD' if provided in valid format
                birthday = datetime.strptime(updated_contact['birthday'], '%Y-%m-%d')
                updated_contact['birthday'] = birthday.strftime('%Y-%m-%d')
            except ValueError:
                return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD format.'}), 400
        else:
            # Set birthday to None if provided as an empty value
            updated_contact['birthday'] = None
    else:
        # Exclude the birthday field from the update if it's not part of the request
        updated_contact.pop('birthday', None)

    # Database update
    conn = get_db_connection()
    cursor = conn.cursor()

    # Dynamically construct the SQL statement to update only provided fields
    update_fields = ['name', 'email', 'phone', 'location', 'is_favorite']
    update_query = "UPDATE contacts SET " + ", ".join(f"{field} = %s" for field in update_fields)
    update_values = [updated_contact[field] for field in update_fields if field in updated_contact]

    if 'birthday' in updated_contact:
        update_query += ", birthday = %s"
        update_values.append(updated_contact['birthday'])

    update_query += " WHERE id = %s"
    update_values.append(id)

    cursor.execute(update_query, tuple(update_values))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(updated_contact), 200

@app.route('/delete_contact/<int:id>', methods=['DELETE'])
def delete_contact(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Execute the delete statement
    cursor.execute('DELETE FROM contacts WHERE id = %s', (id,))
    conn.commit()

    # Check if any row was affected (deleted)
    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({'message': 'Contact not found'}), 404

    cursor.close()
    conn.close()
    return jsonify({'message': 'Contact deleted successfully'}), 200


@app.route('/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM tasks')
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    task_description = request.json['task_description']
    status = request.json['status']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tasks (task_description, status) VALUES (%s, %s)', 
                   (task_description, status))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({
        'task_id': cursor.lastrowid,
        'task_description': task_description,
        'status': status
    })

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    status = request.json['status']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE tasks SET status = %s WHERE task_id = %s', (status, task_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'task_id': task_id, 'status': status})

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tasks WHERE task_id = %s', (task_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return '', 204
            

if __name__ == '__main__':
    app.run(debug=True)
