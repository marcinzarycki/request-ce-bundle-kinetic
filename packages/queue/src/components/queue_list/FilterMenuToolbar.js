import React, { Fragment } from 'react';
import { Popover, PopoverBody, UncontrolledTooltip } from 'reactstrap';
import { FilterMenuAbstract } from '../filter_menu/FilterMenuAbstract';
import isarray from 'isarray';
import { I18n } from '../../../../app/src/I18nProvider';

export const Menu = props => {
  const toggle = props.toggleShowing(props.name);
  const id = `${props.name}-popover`;
  return (
    <Fragment>
      {props.renderButton({ onClick: toggle, id })}
      <Popover
        placement="bottom"
        target={id}
        isOpen={props.showing === props.name}
        toggle={toggle}
      >
        <PopoverBody className="filter-menu-popover">
          {(isarray(props.renderContent)
            ? props.renderContent
            : [props.renderContent]
          ).map((renderContentFn, index) => (
            <div
              className="filter-menu-popover__content"
              key={`content-${index}`}
            >
              {renderContentFn()}
            </div>
          ))}
          {(props.validations.length > 0 ||
            (props.messages && props.messages.length > 0)) && (
            <div className="filter-menu-popover__validations">
              {props.validations.map((validation, i) => (
                <p key={i} className="text-danger">
                  <small>{validation}</small>
                </p>
              ))}
              {props.messages &&
                props.messages.map((message, i) => (
                  <p key={i} className="text-info">
                    <small>{message}</small>
                  </p>
                ))}
            </div>
          )}
          <div className="filter-menu-popover__footer">
            <button className="btn btn-link" onClick={props.reset}>
              {props.resetLabel || 'Reset'}
            </button>
            <button
              className="btn btn-primary"
              onClick={props.apply}
              disabled={!props.dirty || props.validations.length > 0}
            >
              <I18n>{props.applyLabel || 'Apply'}</I18n>
            </button>
          </div>
        </PopoverBody>
      </Popover>
    </Fragment>
  );
};

// Define some simple button components just to cleanup the toolbar component.
const MenuButton = props => (
  <button type="button" className="btn btn-subtle" {...props} />
);
const ClearButton = props => {
  const disabled = typeof props.action === 'string';
  return (
    <Fragment>
      <button
        type="button"
        id={props.id}
        className={`btn btn-subtle ${disabled ? 'disabled' : ''}`}
        onClick={!disabled ? props.action : undefined}
      >
        <i className="fa fa-times" />
      </button>
      {disabled && (
        <UncontrolledTooltip placement="right" target={props.id}>
          {props.action}
        </UncontrolledTooltip>
      )}
    </Fragment>
  );
};

const SortButton = props => {
  const icon = props.direction === 'ASC' ? 'asc' : 'desc';
  return (
    <button
      type="button"
      className="btn btn-link icon-wrapper"
      onClick={props.toggle}
    >
      <span className="icon">
        <span
          className={`fa fa-fw fa-sort-amount-${icon}`}
          style={{ fontSize: '16px', color: '#7e8083' }}
        />
      </span>
    </button>
  );
};
export const FilterMenuToolbar = ({ filter, refresh }) => (
  <FilterMenuAbstract
    filter={filter}
    render={({
      dirty,
      validations,
      apply,
      reset,
      showing,
      toggleShowing,
      ...props
    }) => {
      const popoverProps = {
        dirty,
        apply,
        reset,
        showing,
        toggleShowing,
        validations,
      };
      return (
        <div className="queue-controls">
          <div className="queue-controls__filter">
            <h2
              className={filter.type === 'adhoc' && filter.name ? 'edited' : ''}
            >
              {filter.name || 'Adhoc'}
            </h2>
            <div className="queue-filter-list">
              <I18n
                render={translate => (
                  <Menu
                    name="team"
                    {...popoverProps}
                    renderButton={btnProps =>
                      filter.teams.isEmpty() ? (
                        <MenuButton {...btnProps}>
                          {translate('Any Team')}
                          <i className="fa fa-fw fa-caret-down" />
                        </MenuButton>
                      ) : (
                        <div className="btn-group">
                          <MenuButton {...btnProps}>
                            {translate('Team')}: {props.teamSummary}
                          </MenuButton>
                          <ClearButton action={props.clearTeams} />
                        </div>
                      )
                    }
                    renderContent={() => props.teamFilters}
                  />
                )}
              />
              <Menu
                name="assignment"
                {...popoverProps}
                renderButton={btnProps =>
                  filter.assignments.toSeq().every(b => !b) ? (
                    <MenuButton {...btnProps}>
                      Any Assignment
                      {filter.createdByMe && ' | Created By Me'}
                      <i className="fa fa-fw fa-caret-down" />
                    </MenuButton>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        Assignment: {props.assignmentSummary}
                        {filter.createdByMe && ' | Created By Me'}
                      </MenuButton>
                    </div>
                  )
                }
                renderContent={[
                  () => props.assignmentFilters,
                  () => props.createdByMeFilter,
                ]}
              />
              <Menu
                name="status"
                {...popoverProps}
                renderButton={btnProps =>
                  filter.status.isEmpty() ? (
                    <MenuButton {...btnProps}>
                      Any Status
                      <i className="fa fa-fw fa-caret-down" />
                    </MenuButton>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        Status: {props.statusSummary}
                      </MenuButton>
                      <ClearButton action={props.clearStatus} />
                    </div>
                  )
                }
                renderContent={() => props.statusFilters}
              />
              <Menu
                name="date-range"
                {...popoverProps}
                renderButton={btnProps =>
                  !filter.dateRange.custom && filter.dateRange.preset === '' ? (
                    <MenuButton {...btnProps}>
                      Any Date Range
                      <i className="fa fa-fw fa-caret-down" />
                    </MenuButton>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        {props.dateRangeSummary}
                      </MenuButton>
                      <ClearButton
                        id="clearDateRange"
                        action={props.clearDateRange}
                      />
                    </div>
                  )
                }
                renderContent={() => props.dateRangeFilters}
              />
            </div>
            <div className="queue-filter-save">
              {filter.type === 'adhoc' && (
                <Menu
                  name="save-filter"
                  {...popoverProps}
                  dirty={true}
                  apply={props.saveFilter}
                  applyLabel="Save"
                  reset={toggleShowing('save-filter')}
                  resetLabel="Cancel"
                  messages={props.saveMessages}
                  renderButton={btnProps => (
                    <MenuButton {...btnProps} className="btn btn-primary">
                      Save Filter?
                    </MenuButton>
                  )}
                  renderContent={() => props.saveFilterOptions}
                />
              )}
              {filter.type === 'custom' && (
                <Menu
                  name="delete-filter"
                  {...popoverProps}
                  dirty={true}
                  apply={props.removeFilter}
                  applyLabel="Delete"
                  reset={toggleShowing('delete-filter')}
                  resetLabel="Cancel"
                  renderButton={btnProps => (
                    <MenuButton {...btnProps} className="btn btn-danger">
                      Delete Filter
                    </MenuButton>
                  )}
                  renderContent={() => (
                    <div>
                      <label>Are you sure?</label>
                    </div>
                  )}
                />
              )}
              <button
                type="button"
                className="btn btn-link icon-wrapper"
                onClick={refresh}
              >
                <span className="icon">
                  <span
                    className="fa fa-fw fa-refresh"
                    style={{ fontSize: '16px', color: '#7e8083' }}
                  />
                </span>
              </button>
            </div>
          </div>
          <div className="queue-controls__sorting">
            <div className="queue-controls__item--left">
              <Menu
                name="grouped-by"
                {...popoverProps}
                renderButton={btnProps =>
                  filter.groupBy ? (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        <span
                          className="fa fa-fw fa-folder-open"
                          style={{ fontSize: '14px', color: '#1094C4' }}
                        />{' '}
                        Grouped by {filter.groupBy}
                      </MenuButton>
                      <ClearButton action={props.clearGroupedBy} />
                    </div>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        <span
                          className="fa fa-fw fa-folder-open"
                          style={{ fontSize: '14px', color: '#7e8083' }}
                        />{' '}
                        Ungrouped
                      </MenuButton>
                    </div>
                  )
                }
                renderContent={() => props.groupedByOptions}
              />
              <SortButton
                toggle={props.toggleGroupDirection}
                direction={props.groupDirection}
              />
            </div>
            <div className="queue-controls__item--right">
              <Menu
                name="sorted-by"
                {...popoverProps}
                renderButton={btnProps => (
                  <MenuButton {...btnProps}>
                    <span
                      className="fa fa-fw fa-sort"
                      style={{ fontSize: '14px', color: '#1094C4' }}
                    />{' '}
                    Sorted by {props.sortedBySummary}
                  </MenuButton>
                )}
                renderContent={() => props.sortedByOptions}
              />
              <SortButton
                toggle={props.toggleSortDirection}
                direction={props.sortDirection}
              />
            </div>
          </div>
        </div>
      );
    }}
  />
);
