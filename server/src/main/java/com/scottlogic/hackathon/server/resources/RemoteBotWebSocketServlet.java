package com.scottlogic.hackathon.server.resources;

import java.time.Duration;
import jakarta.servlet.annotation.WebServlet;
import org.eclipse.jetty.websocket.server.JettyWebSocketServlet;
import org.eclipse.jetty.websocket.server.JettyWebSocketServletFactory;

import com.scottlogic.hackathon.remote.server.RemoteBotSocketCreator;

@WebServlet(
    name = "WebSocket Servlet",
    urlPatterns = {"/connect"})
public class RemoteBotWebSocketServlet extends JettyWebSocketServlet {

  @Override
  public void configure(JettyWebSocketServletFactory factory) {
    factory.setIdleTimeout(Duration.ofMillis(Long.MAX_VALUE));
    factory.setCreator(RemoteBotSocketCreator.INSTANCE);
  }
}
