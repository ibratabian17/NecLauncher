package org.ibratabian.nectarLauncher

import android.os.Bundle
import android.view.WindowManager
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import android.webkit.JavascriptInterface
import android.content.Intent
import android.app.Application
import android.content.Context
import java.io.IOException
import android.os.Build
import org.ibratabian.nectarLauncher.helper.appIcon.appIcon
import org.ibratabian.nectarLauncher.helper.webViewBridge.JsInterface
import android.content.SharedPreferences


/**
 * An example full-screen activity that shows and hides the system UI (i.e. status bar and
 * navigation/system bar) with user interaction.
 */
class HomeActivity : AppCompatActivity() {
    // init da ui
    private lateinit var uiNecWebview: WebView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)
        window.setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
        uiNecWebview = findViewById(R.id.webLayout)
        uiNecWebview.webViewClient = Callback()
        var webSettings = uiNecWebview!!.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.allowFileAccess = true
        webSettings.allowFileAccessFromFileURLs = true
        webSettings.allowUniversalAccessFromFileURLs = true
        webSettings.useWideViewPort = true
        webSettings.mediaPlaybackRequiresUserGesture = false

        webSettings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        uiNecWebview.loadUrl("file:///android_asset/home.html")
        uiNecWebview.addJavascriptInterface(JsInterface(applicationContext), "SysOS")
        uiNecWebview.addJavascriptInterface(this, "SysOSHome")
    }


    private inner class Callback : WebViewClient() {
        override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
            return false
        }
    }

    @JavascriptInterface
    fun openUI(url: String): Boolean {
       val intent = Intent(this@HomeActivity, SubAppActivity::class.java) 
       intent.putExtra("url", "file:///android_asset/" + url)
       startActivity(intent)
       return true
    }

    override fun onBackPressed() {
        if (uiNecWebview.canGoBack()) {
            uiNecWebview.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
