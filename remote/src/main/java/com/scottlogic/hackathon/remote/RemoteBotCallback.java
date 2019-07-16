package com.scottlogic.hackathon.remote;

import com.scottlogic.hackathon.remote.server.Sender;
import lombok.Value;


@Value
public class RemoteBotCallback {
    final RemoteBot bot;
    final Sender sender;
}
