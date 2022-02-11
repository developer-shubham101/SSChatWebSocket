package `in`.newdevpoint.ssnodejschat.adapter

import `in`.newdevpoint.ssnodejschat.R

import `in`.newdevpoint.ssnodejschat.databinding.RowUserSelectedListBinding
import `in`.newdevpoint.ssnodejschat.model.FSUsersModel
import android.view.LayoutInflater
import android.view.View
import android.view.View.GONE
import android.view.View.VISIBLE
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.RecyclerView
import java.util.*

class UsersListSelectedAdapter(private val callBack: CallBackForSinglePost) : RecyclerView.Adapter<UsersListSelectedAdapter.MyViewHolder>() {
    private val list: ArrayList<FSUsersModel> = ArrayList<FSUsersModel>()
    private val TAG = UsersListSelectedAdapter::class.java.simpleName
    private var isGroupMode = false
    fun isGroupMode(): Boolean {
        return isGroupMode
    }

    fun setGroupMode(groupMode: Boolean) {
        isGroupMode = groupMode
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        val binding: RowUserSelectedListBinding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                R.layout.row_user_selected_list, parent, false)
        return MyViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val item: FSUsersModel = list[position]

        holder.binding.rowSelectedName.setText(item.name)
        if(item.isChecked){
            holder.binding.rowSelectedChked.visibility=VISIBLE
        }else{
            holder.binding.rowSelectedChked.visibility=GONE
        }

    }

    override fun getItemCount(): Int {
        return list.size
    }

    fun addAll(list: ArrayList<FSUsersModel>?) {
        this.list.clear()
        this.list.addAll(list!!)
        notifyDataSetChanged()
    }

    fun removeItem(pos: Int){
        this.list.removeAt(pos)
        notifyDataSetChanged()
    }

    fun getAllList(): ArrayList<FSUsersModel> {
        return list
    }

    interface CallBackForSinglePost {

        fun onClickRemove(item: FSUsersModel,position: Int)
    }

    inner class MyViewHolder(val binding: RowUserSelectedListBinding) : RecyclerView.ViewHolder(binding.root) {
        init {
            binding.root.setOnClickListener { v: View? ->
                if (isGroupMode) {
                    val tmpItem: FSUsersModel = list[adapterPosition]
                    tmpItem.isChecked = !tmpItem.isChecked
                    notifyDataSetChanged()
                } else {
                    callBack.onClickRemove(list[adapterPosition], adapterPosition)
                }
            }
        }
    }
}