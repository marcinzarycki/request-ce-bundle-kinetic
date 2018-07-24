import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { bundle } from 'react-kinetic-core';
import { selectHasSharedTaskEngine } from '../../redux/modules/spaceApp';

import { NOTIFICATIONS_FORM_SLUG } from '../../redux/modules/settingsNotifications';
import { ROBOT_DEFINITIONS_FORM_SLUG } from '../../redux/modules/settingsRobots';

export const SidebarComponent = ({
  settingsBackPath,
  hasSharedTaskEngine,
  loading,
  loadingConsoles,
  consoles,
  spaceAdmin,
  showDatastore,
  showNotifications,
  showRobots,
}) => (
  <div className="sidebar space-sidebar">
    <Link to={settingsBackPath} className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      Return to Home
    </Link>
    {!loading &&
      !loadingConsoles && (
        <ul className="nav flex-column settings-group">
          <li className="nav-item">
            <NavLink
              to="/settings/profile"
              className="nav-link"
              activeClassName="active"
            >
              Profile
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
            {spaceAdmin && (
              <NavLink
                to="/settings/space"
                className="nav-link"
                activeClassName="active"
              >
                General
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {showDatastore && (
              <NavLink
                to="/settings/datastore"
                className="nav-link"
                activeClassName="active"
              >
                Datastore
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {showNotifications && (
              <NavLink
                to="/settings/notifications"
                className="nav-link"
                activeClassName="active"
              >
                Notifications
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {showRobots && (
              <NavLink
                to="/settings/robots"
                className="nav-link"
                activeClassName="active"
              >
                Robots
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {spaceAdmin && (
              <NavLink
                to="/settings/users"
                className="nav-link"
                activeClassName="active"
              >
                Users
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {consoles.map(console => {
              return console.attributes['Parent Console Slug'] ? null : (
                <NavLink
                  key={console.slug}
                  to={`/settings/${console.slug}`}
                  className="nav-link"
                  activeClassName="active"
                >
                  {console.name}
                  <span className="fa fa-fw fa-angle-right" />
                </NavLink>
              );
            })}
          </li>
        </ul>
      )}
    {spaceAdmin && (
      <div className="sidebar-group sidebar-group--settings">
        <ul className="nav flex-column settings-group">
          <li>
            <a
              href={`${bundle.spaceLocation()}/app`}
              target="blank"
              className="nav-link"
            >
              Kinetic Request Admin
              <span className="fa fa-fw fa-external-link" />
            </a>
          </li>
          {!hasSharedTaskEngine && (
            <li>
              <a
                href={`${bundle.spaceLocation()}/kinetic-task`}
                target="blank"
                className="nav-link"
              >
                Kinetic Task Admin
                <span className="fa fa-fw fa-external-link" />
              </a>
            </li>
          )}
        </ul>
      </div>
    )}
  </div>
);

export const mapStateToProps = state => ({
  loading: state.space.settingsDatastore.loading,
  forms: state.space.settingsDatastore.forms,
  loadingConsoles: state.space.settingsConsoles.loading,
  consoles: state.space.settingsConsoles.consoles,
  spaceAdmin: state.app.profile.spaceAdmin,
  pathname: state.router.location.pathname,
  hasSharedTaskEngine: selectHasSharedTaskEngine(state),
});

export const Sidebar = compose(
  connect(mapStateToProps),
  withProps(props => ({
    showDatastore: props.spaceAdmin || !props.forms.isEmpty(),
    showNotifications: !!props.forms.find(
      form => form.slug === NOTIFICATIONS_FORM_SLUG,
    ),
    showRobots: !!props.forms.find(
      form => form.slug === ROBOT_DEFINITIONS_FORM_SLUG,
    ),
  })),
)(SidebarComponent);
