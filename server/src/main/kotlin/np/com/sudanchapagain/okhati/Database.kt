package np.com.sudanchapagain.okhati

import java.sql.Connection
import java.sql.DriverManager
import org.mindrot.jbcrypt.BCrypt

object AppDatabase {
    private const val DB_URL = "jdbc:h2:file:./okhati_db;DB_CLOSE_DELAY=-1"
    private const val DB_DRIVER = "org.h2.Driver"

    fun getConnection(): Connection {
        Class.forName(DB_DRIVER)
        return DriverManager.getConnection(DB_URL)
    }

    fun init() {
        getConnection().use { conn ->
            val statement = conn.createStatement()
            
            statement.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL,
                    role VARCHAR(20) DEFAULT 'USER'
                )
            """)

            val checkAdmin = conn.prepareStatement("SELECT * FROM users WHERE username = ?")
            checkAdmin.setString(1, "admin")

            val rs = checkAdmin.executeQuery()
            if (!rs.next()) {
                val insertAdmin = conn.prepareStatement(
                    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
                )
                insertAdmin.setString(1, "admin")
                insertAdmin.setString(2, "admin@okhati.com")
                insertAdmin.setString(3, BCrypt.hashpw("admin123", BCrypt.gensalt()))
                insertAdmin.setString(4, "ADMIN")
                insertAdmin.executeUpdate()
            }
        }
    }
}
