package org.ibratabian.nectarLauncher.helper.webViewBridge

import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.app.Application
import android.content.Context
import java.io.IOException
import android.os.Build
import android.app.PendingIntent
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import android.graphics.BitmapFactory
import android.util.Base64
import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.content.pm.ResolveInfo
import org.ibratabian.nectarLauncher.helper.appIcon.appIcon
import android.content.SharedPreferences

class JsInterface(private val mContext: Context) {
    private val packageManager: PackageManager = mContext.packageManager  
    private val sharedPref: SharedPreferences = mContext.getSharedPreferences("NecData", Context.MODE_PRIVATE)


    @JavascriptInterface
    fun getGameList(): String {
        val installedPackages = packageManager.getInstalledApplications(0)
        
        val gameList = JSONObject()
        installedPackages.forEach { applicationInfo ->
            val packageName = applicationInfo.packageName
            if ( applicationInfo.category == ApplicationInfo.CATEGORY_GAME) {
                val appName = packageManager.getApplicationLabel(applicationInfo).toString()
                
                val gameInfo = JSONObject()
                val assets = JSONObject()
                assets.put("cover", "")
                assets.put("coverBkg", "") // Assuming same icon for cover and coverBkg
                gameInfo.put("assets", assets)
                gameInfo.put("name", appName)
                gameInfo.put("launchtype", "app-android")
                gameInfo.put("platform", arrayOf("android"))
                val launchParam = JSONObject()
                launchParam.put("package", packageName)
                gameInfo.put("launchparam", launchParam)
                
                gameList.put(packageName, gameInfo)
            }
        }
        return gameList.toString()
    }

    @JavascriptInterface
    fun getAppList(): String {
        val intent = Intent(Intent.ACTION_MAIN, null)
        intent.addCategory(Intent.CATEGORY_LAUNCHER)
        val resolvedActivities = packageManager.queryIntentActivities(intent, 0)
    
        val appList = JSONObject()
        resolvedActivities.forEach { resolveInfo ->
            val packageName = resolveInfo.activityInfo.packageName
            if (true) { // You can add your condition here if needed
                val appName = resolveInfo.loadLabel(packageManager).toString()
    
                val appInfo = JSONObject()
                val assets = JSONObject()
                assets.put("cover", "")
                assets.put("coverBkg", "") // Assuming same icon for cover and coverBkg
                appInfo.put("assets", assets)
                appInfo.put("name", appName)
                appInfo.put("launchtype", "app-android")
                appInfo.put("platform", arrayOf("android"))
                val launchParam = JSONObject()
                launchParam.put("package", packageName)
                appInfo.put("launchparam", launchParam)
                appList.put(packageName, appInfo)
            }
        }
        return appList.toString()
    }

    @JavascriptInterface
    fun getAppIcon(packageName: String): String{
        val icon = appIcon.getAppIcon(packageManager, packageName)
        // Convert icon to base64
        val base64Icon = encodeIcon(icon)
        return base64Icon
    }
    

    @JavascriptInterface
    fun getSharedPrefences(key: String): String {
        val stringValue = sharedPref.getString(key, "{}")
        return stringValue ?: ""
    }
    
     @JavascriptInterface
     fun openApp(packageName: String, isLeanback: Boolean): Boolean {
         val leanbackIntent = packageManager.getLeanbackLaunchIntentForPackage(packageName)
 
         val normalIntent = packageManager.getLaunchIntentForPackage(packageName)
 
         val intent = leanbackIntent ?: normalIntent;
 
         //intent = null if the app doesn't exist
         if (intent != null) {
             val pendingIntent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                 PendingIntent.getActivity(mContext, 0, intent, PendingIntent.FLAG_IMMUTABLE)
             } else {
                 PendingIntent.getActivity(mContext, 0, intent, 0)
             }
             pendingIntent.send()
             return true
         } else {
             return false
         }
     }

     fun encodeIcon(bitmap: Bitmap?): String {
         if (bitmap == null) {
             return ""
         }
         val byteArrayOutputStream = ByteArrayOutputStream()
         bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
         val byteArray = byteArrayOutputStream.toByteArray()
         return Base64.encodeToString(byteArray, Base64.DEFAULT)
     }

 }