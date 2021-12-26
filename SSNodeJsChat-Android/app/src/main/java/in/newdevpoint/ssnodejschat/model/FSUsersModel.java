package in.newdevpoint.ssnodejschat.model;
import com.google.gson.annotations.SerializedName;


import java.io.Serializable;

public class FSUsersModel implements Serializable {

    @SerializedName("userName")
    private String userName = "";


    @SerializedName("firstName")
    private String name = "";


    @SerializedName("email")
    private String email = "";

    @SerializedName("userId")
    private String id;

    @SerializedName("profile_pic")
    private String profile_image = "";

    @SerializedName("last_seen")
    private String lastSeen = "";

    @SerializedName("is_online")
    private boolean isOnline = false;


    private boolean isChecked = false;

    public FSUsersModel() {
    }

    public boolean isChecked() {
        return isChecked;
    }

    public void setChecked(boolean checked) {
        isChecked = checked;
    }

    public String getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(String lastSeen) {
        this.lastSeen = lastSeen;
    }

    public boolean isOnline() {
        return isOnline;
    }

    public void setOnline(boolean online) {
        isOnline = online;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProfile_image() {
        return profile_image;
    }

    public void setProfile_image(String profile_image) {
        this.profile_image = profile_image;
    }
}
