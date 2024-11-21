# OddsQuest Backend Application Setup and Running Guide

## 1. Virtual Environment Setup

```bash
# Create a new directory for the project
mkdir oddsquest_backend
cd oddsquest_backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

## 2. Install Dependencies

```bash
# Install requirements
pip install -r requirements.txt

# Or if you're creating requirements.txt from scratch
pip install flask flask-sqlalchemy flask-cors python-dotenv
pip freeze > requirements.txt
```

## 3. Environment Configuration

Create a `.env` file in the project root:

```
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your_super_secret_key_here
DATABASE_URL=sqlite:///oddsquest.db
```

## 4. Database Initialization

```bash
# Create database tables
flask create-db

# Alternatively, you can do this in Python
python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"
```

## 5. Running the Application

```bash
# Method 1: Using Flask CLI
flask run

# Method 2: Using Python directly
python run.py

# Method 3: With more explicit configuration
FLASK_APP=run.py FLASK_ENV=development flask run
```

## 6. Development Mode with Debug

Modify `run.py` to enable more detailed debugging:

```python
if __name__ == '__main__':
    app.run(
        debug=True,  # Enables debug mode
        host='0.0.0.0',  # Makes server externally visible
        port=5000  # Specify port (optional)
    )
```

## 7. Additional Helpful Commands

```bash
# Create a new database migration
flask db migrate -m "Initial migration"

# Apply migrations
flask db upgrade

# Create a new user (example)
python -c "from app import create_app, db; from app.models.user import User; app = create_app(); app.app_context().push(); new_user = User(username='testuser', email='test@example.com'); db.session.add(new_user); db.session.commit()"
```

## Troubleshooting Tips

- Ensure you're in the virtual environment
- Check that all dependencies are installed
- Verify the `.env` file is correctly configured
- Make sure you've run database initialization

## Recommended Project Structure After Setup

```
oddsquest_backend/
│
├── venv/                # Virtual environment
├── app/                 # Main application package
│   ├── __init__.py
│   ├── routes/
│   ├── models/
│   └── utils/
│
├── .env                 # Environment variables
├── config.py            # Configuration management
├── requirements.txt     # Project dependencies
├── run.py               # Application entry point
└── README.md            # Project documentation
```

## Development Workflow

1. Activate virtual environment
2. Set environment variables
3. Initialize database (if needed)
4. Run the application
5. Develop and test your routes and models