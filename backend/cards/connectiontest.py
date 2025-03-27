import psycopg2

try:
    connection = psycopg2.connect(
        dbname="tcg_trader_db", 
        user="postgres_user", 
        password="your_password", 
        host="db", 
        port="5432"
    )
    print("Connected to the database")
except Exception as e:
    print("Failed to connect to the database:", e)