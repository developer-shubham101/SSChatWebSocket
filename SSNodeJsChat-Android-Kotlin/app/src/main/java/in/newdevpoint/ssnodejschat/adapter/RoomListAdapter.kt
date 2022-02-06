package `in`.newdevpoint.ssnodejschat.adapter

import `in`.newdevpoint.ssnodejschat.AppApplication
import `in`.newdevpoint.ssnodejschat.R
import `in`.newdevpoint.ssnodejschat.databinding.RowRoomListBinding
import `in`.newdevpoint.ssnodejschat.model.FSRoomModel
import `in`.newdevpoint.ssnodejschat.model.FSUsersModel
import `in`.newdevpoint.ssnodejschat.utility.TimeShow.timeFormatYesterdayToDay
import `in`.newdevpoint.ssnodejschat.utility.UserDetails
import `in`.newdevpoint.ssnodejschat.utility.getImageString
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import java.util.*

class RoomListAdapter(private val context: Context, private val callBack: CallBackForSinglePost) :
    RecyclerView.Adapter<RoomListAdapter.MyViewHolder>() {
    private val list: ArrayList<FSRoomModel> = ArrayList<FSRoomModel>()
    private val TAG = RoomListAdapter::class.java.simpleName
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        val binding: RowRoomListBinding = DataBindingUtil.inflate(
            LayoutInflater.from(parent.context),
            R.layout.row_room_list,
            parent,
            false
        )
        return MyViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val item: FSRoomModel = list[position]
        if (item.isGroup) {
            holder.binding.rowChatUserName.text = item.groupDetails!!.group_name
            holder.binding.onlineStatusOffline.visibility = View.GONE
            holder.binding.onlineStatusOnline.visibility = View.GONE
        } else {
            holder.binding.rowChatUserName.text = item.senderUserDetail!!.name
            if (item.senderUserDetail != null) {
//            holder.binding.rowChatUserPic

                val userImage = item.senderUserDetail!!.profile_image.getImageString()
                if (userImage != null) {
                    Glide.with(context)
                        .setDefaultRequestOptions(AppApplication.USER_PROFILE_DEFAULT_GLIDE_CONFIG)
                        .load(userImage)
                        .into(holder.binding.rowChatUserPic)
                }


                if (item.senderUserDetail!!.isOnline) {
                    holder.binding.onlineStatusOffline.visibility = View.GONE
                    holder.binding.onlineStatusOnline.visibility = View.VISIBLE
                } else {
                    holder.binding.onlineStatusOffline.visibility = View.VISIBLE
                    holder.binding.onlineStatusOnline.visibility = View.GONE
                }
            }
        }
        holder.binding.rowChatUserLastMessage.text = item.lastMessage
        holder.binding.rowChatUserLastMessageTime.text =
            timeFormatYesterdayToDay(item.lastMessageTime, "yyyy-MM-dd'T'HH:mm:ss.SSS")
        if (item.unread != null && item.unread!![UserDetails.myDetail.id] != null) {
            val unreadCount: Int = item.unread!![UserDetails.myDetail.id]!!
            if (unreadCount > 0) {
                holder.binding.rowChatUserPendingMessages.visibility = View.VISIBLE
            } else {
                holder.binding.rowChatUserPendingMessages.visibility = View.INVISIBLE
            }
            if (unreadCount > 99) {
                holder.binding.rowChatUserPendingMessages.text = "99+"
            } else {
                holder.binding.rowChatUserPendingMessages.text = unreadCount.toString()
            }
        } else {
            holder.binding.rowChatUserPendingMessages.visibility = View.INVISIBLE
        }


        //holder.binding.onlineStatusOffline.visibility = View.GONE
        //  holder.binding.onlineStatusOnline.visibility = View.GONE
    }

    override fun getItemCount(): Int {
        return list.size
    }

    fun addAll(list: ArrayList<FSRoomModel>?) {
        this.list.clear()
        this.list.addAll(list!!)
        notifyDataSetChanged()
    }

    fun add(item: FSRoomModel) {
        list.add(item)
        notifyDataSetChanged()
    }

    fun addOrUpdate(item: FSRoomModel) {
        var isAlreadyAdded = false
        for (element in list) {
            if (element.roomId == item.roomId) {
                isAlreadyAdded = true
                break
            }
        }
        if (isAlreadyAdded) {
            updateElement(item)
        } else {
            list.add(item)
            notifyDataSetChanged()
        }
    }

    fun updateUserElement(element: FSUsersModel) {
        for (i in list.indices) {
            if (list[i].senderUserDetail!!.id == element.id) {
                list[i].senderUserDetail = element
                notifyDataSetChanged()
            }
        }
    }

    fun updateElement(element: FSRoomModel) {
        for (i in this.list.indices) {
            if (list[i].roomId == element.roomId) {
//                this.list.set(i, element);
                list.removeAt(i)
                list.add(0, element)
                notifyDataSetChanged()
                break
            }
        }
    }

    fun getAllList(): ArrayList<FSRoomModel> {
        return list
    }

    interface CallBackForSinglePost {
        fun onClick(position: Int)
        fun onClick(item: FSRoomModel)
    }

    inner class MyViewHolder(val binding: RowRoomListBinding) :
        RecyclerView.ViewHolder(binding.root) {
        init {
            binding.root.setOnClickListener { callBack.onClick(list[adapterPosition]) }
        }
    }
}