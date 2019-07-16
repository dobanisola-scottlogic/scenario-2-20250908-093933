package com.scottlogic.hackathon.remote.notify;

import com.scottlogic.hackathon.remote.ConnectionListener;

import java.util.ArrayList;
import java.util.List;

public class ConnectionChangeSupport implements ChangeSupport<ConnectionListener, ConnectionChangeEvent> {

    private List<ConnectionListener> listeners = new ArrayList<>();

    @Override
    public void addChangeEventListener(ConnectionListener toAdd) {
        listeners.add(toAdd);
    }

    @Override
    public void fireChangeEvent(ConnectionChangeEvent event) {
        listeners.forEach(l -> l.onChangeEvent(event));
    }

    public int count(){
       return listeners.size();
    }

    public boolean hasTargetListener(String target){
        return listeners.stream().anyMatch(l -> l.isTeam(target));
    }


}



