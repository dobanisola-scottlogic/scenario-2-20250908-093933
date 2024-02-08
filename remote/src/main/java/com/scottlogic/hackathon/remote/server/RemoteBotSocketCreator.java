package com.scottlogic.hackathon.remote.server;

import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeResponse;
import org.eclipse.jetty.websocket.server.JettyWebSocketCreator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.game.UniqueIdGenerator;
import com.scottlogic.hackathon.remote.ConnectionListener;
import com.scottlogic.hackathon.remote.Turn;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeSupport;

public enum RemoteBotSocketCreator implements JettyWebSocketCreator {
  INSTANCE;

  private static final Logger log = LoggerFactory.getLogger(RemoteBotSocketCreator.class);

  private final ConnectionChangeSupport observable;

  RemoteBotSocketCreator() {
    this.observable = new ConnectionChangeSupport();
  }

  public void addConnectionListener(ConnectionListener observer) {
    observable.addChangeEventListener(observer);
    log.debug("have {} connection listeners", observable.count());
  }

  @Override
  public Object createWebSocket(JettyServerUpgradeRequest req, JettyServerUpgradeResponse resp) {
    log.debug("creating socket");
    resp.addHeader("id", UniqueIdGenerator.INSTANCE.next().toString());
    Interactor interactor = new Interactor(observable, new Turn());
    return interactor.getAdapter();
  }
}
