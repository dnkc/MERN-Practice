import React, { Component } from "react";
import isEmpty from "../../validation/is-empty-client";
class ProfileHeader extends Component {
  constructor() {
    super();
  }
  render() {
    const { profile } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={profile.user.avatar}
                  alt=""
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">
                {profile.user.name ? profile.user.name : null}
              </h1>
              <p className="lead text-center">
                {profile.status} at{" "}
                {isEmpty(profile.company) ? null : (
                  <span>{profile.company}</span>
                )}
              </p>
              <p>
                {isEmpty(profile.location) ? null : (
                  <span>{profile.location}</span>
                )}
              </p>
              <p>
                {isEmpty(profile.website) ? null : (
                  <>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white p-2"
                      href={`http://${profile.website}`}
                    >
                      <i className="fas fa-globe fa-2x"></i>
                    </a>
                  </>
                )}
                {isEmpty(profile.social && profile.social.twitter) ? null : (
                  <>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-white p-2"
                      href={`http://${profile.social.twitter}`}
                    >
                      <i className="fab fa-twitter fa-2x"></i>
                    </a>
                  </>
                )}
                {isEmpty(profile.social && profile.social.facebook) ? null : (
                  <>
                    <a
                      className="text-white p-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`http://${profile.social.facebook}`}
                    >
                      <i className="fab fa-facebook fa-2x"></i>
                    </a>
                  </>
                )}
                {isEmpty(profile.social && profile.social.linkedin) ? null : (
                  <>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white p-2"
                      href={`http://${profile.social.linkedin}`}
                    >
                      <i className="fab fa-linkedin fa-2x"></i>
                    </a>
                  </>
                )}
                {isEmpty(profile.social && profile.social.instagram) ? null : (
                  <>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white p-2"
                      href={`http://${profile.social.instagram}`}
                    >
                      <i className="fab fa-instagram fa-2x"></i>
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
