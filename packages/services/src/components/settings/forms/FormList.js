import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { TimeAgo } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { displayableFormPredicate } from '../../../utils';

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Services Forms Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
    </div>
  );
};

const Timestamp = ({ slug, label, value }) =>
  value && (
    <span>
      {label}
      &nbsp;
      <TimeAgo timestamp={value} />
    </span>
  );

const FormListComponent = ({
  servicesForms,
  loading,
  match,
  toggleDropdown,
  openDropdown,
}) => {
  return (
    <div className="page-container page-container--datastore">
      <div className="page-panel page-panel--scrollable page-panel--datastore-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/kapps/services">services</Link> /{` `}
              <Link to="/kapps/services/settings">settings</Link> /{` `}
            </h3>
            <h1>Services Forms</h1>
          </div>
          <Link to={`${match.path}/new`} className="btn btn-primary">
            Create Form
          </Link>
        </div>

        <div className="forms-list-wrapper">
          {loading ? (
            <h3>Loading</h3>
          ) : servicesForms && servicesForms.size > 0 ? (
            <table className="table table-sm table-striped table-datastore">
              <thead className="header">
                <tr>
                  <th>Form Name</th>
                  <th width="40%">Description</th>
                  <th width="10%">Updated</th>
                  <th width="10%">Created</th>
                  <th width="48px">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {servicesForms.map(form => {
                  return (
                    <tr key={form.slug}>
                      <td>
                        <Link to={`${match.path}/${form.slug}`}>
                          <span>{form.name}</span>
                        </Link>
                        <br />
                        <small>{form.slug}</small>
                      </td>
                      <td>{form.description}</td>
                      <td>
                        <Timestamp
                          value={form.updatedAt ? form.updatedAt : null}
                          slug={form.slug}
                        />
                      </td>
                      <td>
                        <Timestamp
                          value={form.createdAt ? form.createdAt : null}
                          slug={form.slug}
                        />
                      </td>
                      <td>
                        <Dropdown
                          toggle={toggleDropdown(form.slug)}
                          isOpen={openDropdown === form.slug}
                        >
                          <DropdownToggle color="link" className="btn-sm">
                            <span className="fa fa-ellipsis-h fa-2x" />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem
                              tag={Link}
                              to={`${match.path}/${form.slug}/settings`}
                            >
                              Configure Form
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <WallyEmptyMessage />
          )}
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.services.forms.loading,
  servicesForms: state.services.forms.data.filter(displayableFormPredicate),
});

export const mapDispatchToProps = {
  push,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const FormList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({ toggleDropdown }),
  lifecycle({
    componentWillMount() {},
  }),
)(FormListComponent);
