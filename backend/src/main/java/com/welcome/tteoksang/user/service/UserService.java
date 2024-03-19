package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.req.UpdateUserNameReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserThemeReq;

import java.net.URISyntaxException;

public interface UserService {

    public void updateUserName(UpdateUserNameReq updateUserNameReq, User user);

    public void updateUserTheme(UpdateUserThemeReq updateUserThemeReq, User user);

    public void deleteUser(User user) throws URISyntaxException;

}
