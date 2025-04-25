CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY
);

CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_name VARCHAR(100),
    description VARCHAR(250)
);

CREATE TABLE tables_ (
    t_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    t_name VARCHAR(100),
    session_id UUID,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);

CREATE TABLE attributes_ (
    t_id UUID,
    attri_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    a_type VARCHAR(50),
    positions INTEGER,
    FOREIGN KEY (t_id) REFERENCES tables_(t_id)
);

CREATE TABLE tuple (
    t_id UUID,
    tu_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    FOREIGN KEY (t_id) REFERENCES tables_(t_id)
);

--CREATE TABLE vals (
--  val_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--val VARCHAR(250)
--);

CREATE TABLE datas (
    tu_id UUID,
    attri_id UUID,
	val VARCHAR(250)
--    val_id UUID,
--    PRIMARY KEY (tu_id, attri_id, val_id),
    FOREIGN KEY (tu_id) REFERENCES tuple(tu_id),
    FOREIGN KEY (attri_id) REFERENCES attributes_(attri_id),
--    FOREIGN KEY (val_id) REFERENCES vals(val_id)
);


CREATE TABLE relation (
    r_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    r_name VARCHAR(100),
    at_id UUID,
    aa_id UUID,
    ba_id UUID,
    bt_id UUID,
    FOREIGN KEY (at_id) REFERENCES tables_(t_id),
    FOREIGN KEY (aa_id) REFERENCES attributes_(attri_id),
    FOREIGN KEY (ba_id) REFERENCES attributes_(attri_id),
    FOREIGN KEY (bt_id) REFERENCES tables_(t_id)
);

CREATE TABLE relational_data (
    rd_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    r_id UUID,
    a_tid UUID,
    b_tid UUID,
    FOREIGN KEY (r_id) REFERENCES relation(r_id),
    FOREIGN KEY (a_tid) REFERENCES tables_(t_id),
    FOREIGN KEY (b_tid) REFERENCES tables_(t_id)
);

CREATE TABLE relational_attribute (
    a_id UUID,
    r_id UUID,
    aggregate_function VARCHAR(50),
    FOREIGN KEY (a_id) REFERENCES attributes_(attri_id),
    FOREIGN KEY (r_id) REFERENCES relation(r_id)
);

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_view BOOLEAN,
    table_create BOOLEAN,
    member_view BOOLEAN,
    table_edit BOOLEAN,
    member_edit BOOLEAN
);

CREATE TABLE roles_table_view (
    role_id UUID,
    t_id UUID,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (t_id) REFERENCES tables_(t_id)
);

CREATE TABLE roles_table_edit (
    role_id UUID,
    t_id UUID,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (t_id) REFERENCES tables_(t_id)
);

CREATE TABLE roles_member_view (
    role_id UUID,
    member_id UUID,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (member_id) REFERENCES users(username)
);

CREATE TABLE roles_member_edit (
    role_id UUID,
    member_id UUID,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (member_id) REFERENCES users(username)
);