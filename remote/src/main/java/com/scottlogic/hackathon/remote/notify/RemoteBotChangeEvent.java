package com.scottlogic.hackathon.remote.notify;

import com.scottlogic.hackathon.remote.RemoteBot;
import lombok.Value;

@Value
public class RemoteBotChangeEvent implements ChangeEvent<RemoteBot> {
    String target;
    RemoteBot oldValue;
    RemoteBot newValue;
}
