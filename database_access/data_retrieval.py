import pyodbc

' ###### establishing connection #################'

def establish_database_connection():
    try:
        ' ###################### connection parameters ####################'
        server = r'DESKTOP-5S013HL\SQL2022EXPRESS'
        database = 'ProjektarbeitPP'
        driver = '{ODBC Driver 17 for SQL Server}'

        ' ############### open connection ###########################'
        connection_string = f"""
                DRIVER={driver};SERVER={server};DATABASE={database};Trusted_Connection=yes"""
        connection = pyodbc.connect(connection_string)
        print("Connection succesfully established")
    except pyodbc.Error as e:
        print("Connection error: ", e)
    return connection

' ################### simple select queries ################'
def make_query(input_query, connection):
    try:
        cursor = connection.cursor()

        query1 = input_query
        cursor.execute(query1)

        rows = cursor.fetchall()
        return rows
    except Exception as e:
        print(f"Fehler bei der SQL-Abfrage:\n{e}")
        return None
   
' ####### quick test ################### '   
# connection = establish_database_connection()
# query = "SELECT TOP 5 * FROM products LIMIT 1"
# results = make_query(query, connection)
# if results:
#     for result in results:
#         print(result)
#     print("\n\n\n", len(results))


# ' ################ reading sql query results to pandas ##########'
# # reuse connection
# connection = pyodbc.connect(connection_string)
# sql_data = pd.read_sql(sql = query3, con=connection)
# print(sql_data.head(3), type(sql_data))
# print(sql_data.columns)
# print(sql_data[["total_price", "due_limit"]].head(3))

# ' ############################# close connection ########################'
# connection.close()
# print("connection closed")