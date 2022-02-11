package `in`.newdevpoint.ssnodejschat.activity

import `in`.newdevpoint.ssnodejschat.R
import `in`.newdevpoint.ssnodejschat.databinding.GroupdetailActivityBinding
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil

class GroupDetailActivity: AppCompatActivity() {
    lateinit var binding : GroupdetailActivityBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = DataBindingUtil.setContentView(this@GroupDetailActivity,R.layout.groupdetail_activity)
        binding.backBtnImage.setOnClickListener { finish() }
    }


}