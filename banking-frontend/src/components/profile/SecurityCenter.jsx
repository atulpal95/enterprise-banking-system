import {
    FaLock,
    FaCamera,
    FaChevronRight
} from "react-icons/fa";

function SecurityCenter({
    onChangePassword,
    onChangePhoto
}) {

    return (

        <section className="security-section">

            <h2 className="section-title">
                Security Center
            </h2>

            <div className="security-grid">

                <div
                    className="security-card"
                    onClick={onChangePassword}
                >
                    <div className="security-left">
                        <div className="security-icon blue">
                            <FaLock />
                        </div>

                        <div>
                            <h3>Change Password</h3>
                            <p>
                                Update your account password regularly to
                                keep your account secure.
                            </p>
                        </div>
                    </div>

                    <FaChevronRight className="security-arrow" />
                </div>

                <div
                    className="security-card"
                    onClick={onChangePhoto}
                >
                    <div className="security-left">

                        <div className="security-icon green">
                            <FaCamera />
                        </div>

                        <div>
                            <h3>Change Profile Photo</h3>
                            <p>
                                Upload a new profile picture for your
                                banking account.
                            </p>
                        </div>

                    </div>

                    <FaChevronRight className="security-arrow" />
                </div>

            </div>

        </section>

    );

}

export default SecurityCenter;