-- F-Line Appeal table
CREATE SEQUENCE IF NOT EXISTS fline_appeal_slno_seq START 1;

CREATE TABLE IF NOT EXISTS fline_appeal (
    slno              BIGINT      NOT NULL DEFAULT nextval('fline_appeal_slno_seq'),
    mobile            VARCHAR(10) NOT NULL,
    applicant_name    VARCHAR(100) NOT NULL,
    district_code     VARCHAR(2)  NOT NULL,
    taluk_code        VARCHAR(2)  NOT NULL,
    village_code      VARCHAR(3)  NOT NULL,
    survey_no         VARCHAR(6)  NOT NULL,
    subdiv_no         VARCHAR(10),
    patta_no          VARCHAR(20),
    ref_appl_id       VARCHAR(25),
    appeal_reason     VARCHAR(500) NOT NULL,
    document_ref      VARCHAR(255),
    status            VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    remarks           VARCHAR(500),
    submit_dt         TIMESTAMP   NOT NULL,
    update_dt         TIMESTAMP,
    appl_id           VARCHAR(30) UNIQUE,
    extent_hect       NUMERIC(10,2),
    extent_ares       NUMERIC(10,2),
    ip_address        VARCHAR(50),
    PRIMARY KEY (slno)
);

CREATE INDEX IF NOT EXISTS idx_fline_appeal_mobile ON fline_appeal(mobile);
CREATE INDEX IF NOT EXISTS idx_fline_appeal_appl_id ON fline_appeal(appl_id);
CREATE INDEX IF NOT EXISTS idx_fline_appeal_status ON fline_appeal(status);
