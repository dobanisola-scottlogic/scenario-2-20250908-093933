package com.scottlogic.hackathon.server.services.stores;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import io.dropwizard.util.Generics;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.context.internal.ManagedSessionContext;
import org.hibernate.query.SelectionQuery;

import static com.google.common.base.Preconditions.checkNotNull;

public class AbstractStore<T> {
  private final SessionFactory sessionFactory;
  private final Class<?> entityClass;

  public AbstractStore(final SessionFactory sessionFactory) {
    this.sessionFactory = sessionFactory;
    this.entityClass = Generics.getTypeParameter(getClass());
  }

  protected Session currentSession() {
    return sessionFactory.getCurrentSession();
  }

  private SelectionQuery<?> createQueryByProperty(final String propertyName, final String value, boolean ignoreCase) {
    try (Session session = currentSession()) {
      String queryString;
      if (ignoreCase) {
        queryString = String.format("from %s where %s ilike :value",
            entityClass.getSimpleName(),
            propertyName);
      } else {
        queryString = String.format("from %s where %s like :value",
            entityClass.getSimpleName(),
            propertyName);
      }
      return session.createSelectionQuery(queryString, entityClass)
          .setParameter("value", value);
    }
  }

  public T save(final T entity) {
    try(Session session = currentSession()) {
      session.persist(checkNotNull(entity));

      return entity;
    }
  }

  public T saveOrUpdate(final T entity) {
    try (Session session = currentSession()) {
      session.merge(checkNotNull(entity));

      return entity;
    }
  }

  public boolean delete(final Serializable id) {
    final T entity = get(id);

    if (entity != null) {
      try (Session session = currentSession()) {
        session.remove(entity);

        return true;
      }
    } else {
      return false;
    }
  }

  @SuppressWarnings("unchecked")
  public T get(final Serializable id) {
    try (Session session = currentSession()) {
      return (T) session.get(entityClass, id);
    }
  }

  @SuppressWarnings("unchecked")
  public T get(final String propertyName, final String value, final boolean ignoreCase) {
    var query = createQueryByProperty(propertyName, value, ignoreCase);

    return (T) query.getSingleResultOrNull();
  }

  public T get(final String propertyName, final String value) {
    return get(propertyName, value, false);
  }

  public List<T> list() {
    try(Session session = currentSession()) {
      @SuppressWarnings("unchecked")
      var entities = (List<T>) session.createSelectionQuery(
        String.format("from %s", entityClass.getSimpleName()),
        entityClass)
        .getResultList();
    return Collections.unmodifiableList(entities);
    }
  }

  public List<T> list(final String propertyName, final String value, boolean ignoreCase) {
    var query = createQueryByProperty(propertyName, value, ignoreCase);

    @SuppressWarnings("unchecked")
    var entities = (List<T>) query.list();
    return Collections.unmodifiableList(entities);
  }

  public List<T> list(final String propertyName, final String value) {
    return list(propertyName, value, false);
  }

  public void runInSession(Runnable runnable) {
    try (Session currentSession = sessionFactory.openSession()) {
      ManagedSessionContext.bind(currentSession);
      currentSession.beginTransaction();
      runnable.run();
      ManagedSessionContext.unbind(sessionFactory);
      currentSession.getTransaction().commit();
    }
  }
}
