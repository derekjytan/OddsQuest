from app import create_app, db

app = create_app()

@app.cli.command('create-db')
def create_db():
    """Create database tables"""
    db.create_all()
    print('Database tables created!')

if __name__ == '__main__':
    app.run(debug=True)