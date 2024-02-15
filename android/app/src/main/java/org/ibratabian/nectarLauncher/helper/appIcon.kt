package org.ibratabian.nectarLauncher.helper.appIcon

import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.AdaptiveIconDrawable
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.graphics.drawable.LayerDrawable
import android.os.Build

object appIcon {

    fun getAppIcon(mPackageManager: PackageManager, packageName: String): Bitmap? {
        return try {
            val drawable: Drawable = mPackageManager.getApplicationIcon(packageName)

            when (drawable) {
                is BitmapDrawable -> {
                    drawable.bitmap
                }
                is AdaptiveIconDrawable -> {
                    val backgroundDr: Drawable? = drawable.background
                    val foregroundDr: Drawable? = drawable.foreground

                    val drr = arrayOf<Drawable?>(backgroundDr, foregroundDr)

                    val layerDrawable = LayerDrawable(drr)

                    val width = layerDrawable.intrinsicWidth
                    val height = layerDrawable.intrinsicHeight

                    val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)

                    val canvas = Canvas(bitmap)

                    layerDrawable.setBounds(0, 0, canvas.width, canvas.height)
                    layerDrawable.draw(canvas)

                    bitmap
                }
                else -> null
            }
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
            null
        }
    }
}
