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
        # set cursor and execute query
        cursor = connection.cursor()
        cursor.execute(input_query)
        # extract column names of retrieved results
        column_names = [column[0] for column in cursor.description]
        # extract all rows of retrieved results
        rows = cursor.fetchall()
        # convert rows to list of dictionaries
        results = [dict(zip(column_names, row)) for row in rows]
        return results
    except Exception as e:
        print(f"Error during execution of sql-query:\n{e}")
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