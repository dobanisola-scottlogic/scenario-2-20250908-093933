package com.scottlogic.hackathon.server;

import java.net.URL;
import java.nio.charset.Charset;
import io.dropwizard.servlets.assets.AssetServlet;
import jakarta.annotation.Nullable;

/**
 * Works the same way as {@link AssetServlet} except if the asset can't be found it defaults to the asset located at
 * the classpath of '${resourcePath}/${indexFile}'.
 * <p>
 * This is especially useful when using a frontend framework that manages its own routing (such as React) where we wish
 * to serve the index.html most of the time. If we did not default to index.html, then if a user were to bookmark
 * or Ctrl+F5 on '/application/ui/hackathon1', then {@link AssetServlet} will look for an asset at classpath
 * '/ui/hackathon1', discover that no such file exists and respond with 404 before the frontend has any chance to
 * handle the routing itself. This servlet will serve index.html in such a case, handing over control to the frontend
 * framework to route the user to /ui/hackathon1.
 *
 * @author Craig Smiles
 */
public class DefaultIndexServlet extends AssetServlet {

    private final URL indexUrl;

    public DefaultIndexServlet(String resourcePath, String uriPath, @Nullable String indexFile, @Nullable Charset defaultCharset) {
        super(resourcePath, uriPath, indexFile, defaultCharset);
        this.indexUrl = DefaultIndexServlet.class.getResource(resourcePath + "/" + indexFile);
    }

    @Override
    protected URL getResourceURL(String absoluteRequestedResourcePath) {
        URL url = DefaultIndexServlet.class.getClassLoader().getResource(absoluteRequestedResourcePath);
        if (url != null) {
            return url;
        }

        return indexUrl;
    }
}
