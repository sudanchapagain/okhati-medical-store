package np.com.sudanchapagain.okhati

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform