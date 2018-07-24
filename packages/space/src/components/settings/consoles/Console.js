import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { CoreForm } from 'react-kinetic-core';
import { Utils } from 'common';

const globals = import('common/globals');

const ConsoleError = () => <h1>Error loading settings console</h1>;

export const ConsoleComponent = ({ match, loading, consoles }) => {
  if (!loading) {
    const console = consoles.find(c => c.slug === match.params.console);
    if (console) {
      let breadcrumbs = List();
      const findBySlug = slug => o => slug === o.slug;
      if (Utils.getAttributeValue(console, 'Parent Console Slug')) {
        const parent = consoles.find(
          findBySlug(Utils.getAttributeValue(console, 'Parent Console Slug')),
        );
        if (parent) {
          breadcrumbs = breadcrumbs.unshift(parent);
        }
      }
      while (
        breadcrumbs.first() &&
        Utils.getAttributeValue(breadcrumbs.first(), 'Parent Console Slug') &&
        !breadcrumbs.find(
          findBySlug(
            Utils.getAttributeValue(breadcrumbs.first(), 'Parent Console Slug'),
          ),
        )
      ) {
        const parent = consoles.find(
          findBySlug(
            Utils.getAttributeValue(breadcrumbs.first(), 'Parent Console Slug'),
          ),
        );
        if (parent) {
          breadcrumbs = breadcrumbs.unshift(parent);
        } else {
          break;
        }
      }
      return (
        <div className="page-container page-container--console">
          <div className="page-panel page-panel--scrollable page-panel--space-console-form">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="/">home</Link> /{` `}
                  <Link to="/settings">settings</Link> /{` `}
                  {breadcrumbs.map(bc => (
                    <Fragment key={bc.slug}>
                      <Link to={`/settings/${bc.slug}`}>{bc.name}</Link> /{` `}
                    </Fragment>
                  ))}
                </h3>
                <h1>{console.name}</h1>
              </div>
            </div>
            <div>
              <CoreForm kapp="admin" form={console.slug} globals={globals} />
            </div>
          </div>
        </div>
      );
    } else {
      return <ConsoleError />;
    }
  } else {
    return null;
  }
};

export const mapStateToProps = state => ({
  loading: state.space.settingsConsoles.loading,
  consoles: state.space.settingsConsoles.consoles,
});

export const Console = connect(mapStateToProps)(ConsoleComponent);
