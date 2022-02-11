package `in`.newdevpoint.ssnodejschat.utility

import `in`.newdevpoint.ssnodejschat.activity.LoginActivity
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences



object AppPreference {
    private var preferenceName: String = "in.newdevpoint.ssnodejschat"
    var token = "token"
    var fcmToken = "fcmToken"
    var email = "email"
    var phone = "phone"
    var venue = "venue"
    var userId = "user_id"
    var mobile = ""
    var name = ""


    fun savePreference(mContext: Context, key: String, value: String) {
        val sharedPreferences: SharedPreferences =
            mContext.getSharedPreferences(preferenceName, Context.MODE_PRIVATE)
        val editor: SharedPreferences.Editor = sharedPreferences.edit()
        editor.putString(key, value)
        editor.apply()
        editor.commit()
    }

    fun getPreferenceValueByKey(mContext: Context, key: String): String? {
        val sharedPreferences: SharedPreferences =
            mContext.getSharedPreferences(preferenceName, Context.MODE_PRIVATE)
        return sharedPreferences.getString(key, "")
    }

    fun saveIntPreference(mContext: Context, key: String, value: Int) {
        val sharedPreferences: SharedPreferences = mContext.getSharedPreferences(preferenceName, Context.MODE_PRIVATE)
        val editor: SharedPreferences.Editor = sharedPreferences.edit()
        editor.putInt(key, value)
        editor.apply()
        editor.commit()
    }

    fun getIntPreferenceValueByKey(mContext: Context, key: String): Int? {
        val sharedPreferences: SharedPreferences =
            mContext.getSharedPreferences(preferenceName, Context.MODE_PRIVATE)
        return sharedPreferences.getInt(key, 0)
    }


    fun logout(mContext: Activity) {
        val sharedPreferences: SharedPreferences =
            mContext.getSharedPreferences(preferenceName, Context.MODE_PRIVATE)
        val editor: SharedPreferences.Editor = sharedPreferences.edit()
        editor.clear()
        editor.apply()
        editor.commit()
        mContext.finish()
        val intent = Intent(mContext, LoginActivity::class.java)
        intent.flags =
            Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
        mContext.startActivity(intent)
    }


}