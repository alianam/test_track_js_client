import qs from 'qs';
import client from './api';

class AssignmentOverride {
  constructor(options = {}) {
    this._visitor = options.visitor;
    this._assignment = options.assignment;
    this._username = options.username;
    this._password = options.password;

    if (!this._visitor) {
      throw new Error('must provide visitor');
    } else if (!this._assignment) {
      throw new Error('must provide assignment');
    } else if (!this._username) {
      throw new Error('must provide username');
    } else if (!this._password) {
      throw new Error('must provide password');
    }
  }

  persistAssignment() {
    return client
      .post(
        '/v1/assignment_override',
        qs.stringify({
          visitor_id: this._visitor.getId(),
          split_name: this._assignment.getSplitName(),
          variant: this._assignment.getVariant(),
          context: this._assignment.getContext(),
          mixpanel_result: 'success' // we don't want to track overrides
        }),
        {
          auth: {
            username: this._username,
            password: this._password
          }
        }
      )
      .catch(({ response }) => {
        this._visitor.logError(
          `test_track persistAssignment error: ${response.status}, ${response.statusText}, ${response.data}`
        );
      });
  }
}

export default AssignmentOverride;
