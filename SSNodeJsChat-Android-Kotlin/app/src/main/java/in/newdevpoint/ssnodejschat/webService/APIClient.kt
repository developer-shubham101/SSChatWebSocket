package `in`.newdevpoint.ssnodejschat.webService

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object APIClient {
    const val IMAGE_URL = "http://testapi.newdevpoint.in/"
    const val BASE_URL_WEB_SOCKET = "ws://sschat-react.herokuapp.com/V1"

    private const val BASE_URL = "http://testapi.newdevpoint.in/"


//    const val IMAGE_URL = "http://172.16.16.231:8000/"
//    const val BASE_URL_WEB_SOCKET = "ws://172.16.16.231:1337/V1"
//
//    private const val BASE_URL = "http://172.16.16.231:8000/"


    private var retrofit: Retrofit? = null

    fun getClient(): Retrofit? {
        if (retrofit == null) {
            val httpBuilder = OkHttpClient.Builder()
            httpBuilder.connectTimeout(60, TimeUnit.SECONDS)
            httpBuilder.readTimeout(10, TimeUnit.MINUTES)
            httpBuilder.writeTimeout(10, TimeUnit.MINUTES)
            httpBuilder.retryOnConnectionFailure(true)
            //            httpBuilder.addInterceptor(new CustomInterceptor(""));
            val okHttpClient = httpBuilder.build()

            //init retrofit
            retrofit = Retrofit.Builder()
                    .client(okHttpClient)
                    .baseUrl(BASE_URL) //                    .addConverterFactory(ScalarsConverterFactory.signUp())
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()
        }
        return retrofit
    }

    object KeyConstant {
        const val REQUEST_TYPE_KEY = "request"
        const val REQUEST_TYPE_LOGIN = "login"
        const val REQUEST_TYPE_CREATE_CONNECTION = "create_connection"
        const val REQUEST_TYPE_ROOM = "room"
        const val REQUEST_TYPE_GROUP_ROOM = "group"
        const val REQUEST_TYPE_USERS = "users"
        const val REQUEST_TYPE_MESSAGE = "message"
        const val REQUEST_TYPE_BLOCK_USER = "block_user"
    }
}