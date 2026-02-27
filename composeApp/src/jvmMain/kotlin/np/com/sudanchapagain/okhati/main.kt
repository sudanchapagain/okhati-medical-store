package np.com.sudanchapagain.okhati

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "Okhati",
    ) {
        App()
    }
}