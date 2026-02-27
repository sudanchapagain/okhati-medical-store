package np.com.sudanchapagain.okhati

import kotlinx.serialization.Serializable

@Serializable
data class Medicine(
    val id: Int? = null,
    val name: String,
    val description: String,
    val price: Double,
    val imageUrl: String? = null,
    val category: String? = null
)

@Serializable
data class User(
    val id: Int? = null,
    val username: String,
    val email: String,
    val role: String = "USER" // USER, ADMIN
)

@Serializable
data class CartItem(
    val medicine: Medicine,
    val quantity: Int
)

@Serializable
data class Order(
    val id: Int? = null,
    val userId: Int,
    val items: List<CartItem>,
    val totalPrice: Double,
    val status: String = "PENDING", // PENDING, COMPLETED, CANCELLED
    val createdAt: Long = 0
)

@Serializable
data class LoginResponse(
    val token: String,
    val user: User
)

@Serializable
data class AuthRequest(
    val username: String,
    val password: String,
    val email: String? = null
)
