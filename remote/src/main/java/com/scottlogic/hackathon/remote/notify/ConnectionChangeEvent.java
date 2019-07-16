package com.scottlogic.hackathon.remote.notify;

import com.scottlogic.hackathon.remote.notify.ChangeEvent;
import com.scottlogic.hackathon.remote.RemoteBotCallback;
import lombok.Value;


@Value
public class ConnectionChangeEvent implements ChangeEvent<RemoteBotCallback> {
    String target;
    RemoteBotCallback oldValue;
    RemoteBotCallback newValue;
}
