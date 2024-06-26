const { Pool } = require('pg/lib');
const PGFormat = require('pg-format');

const PGUtils = {};

const _writePool = new Pool({
	user: 'postgres_write',
	host: (process.env.PGHOST ?? 'localhost'),
	database: process.env.DATABASE_NAME ?? 'postgres_db',
	password: (process.env.PG_WRITE_PASSWORD ?? 'password'),
	port: (process.env.PGPORT ?? 5432),
});

const _readPool = new Pool({
	user: 'postgres_read',
	host: (process.env.PGHOST ?? 'localhost'),
	database: process.env.DATABASE_NAME ?? 'postgres_db',
	password: (process.env.PG_READ_PASSWORD ?? 'password'),
	port: (process.env.PGPORT ?? 5432),
});

_writePool.on('error', (err) => {
	console.error("PGUtils::_writePool error: ", err);
	process.emit('cleanup_and_exit');
});

_readPool.on('error', (err) => {
	console.error("PGUtils::_readPool error: ", err);
	process.emit('cleanup_and_exit');
});

_writePool.on('connect', () => {
	console.log("Log: DB write pool is established!");
	return;
});

_readPool.on('connect', client => {
	console.log("Log: DB read pool established!");
	return;
});

/**
 * Utility function to read from database.
 * @param {object} query
 * @returns {array, ERROR}
 */
PGUtils.readQuery = async (query) => {
	if (process.env.DEBUG) console.debug("PGUtils::readQuery: text: ", query.text);
	try {
		let readQueryResult = await new Promise((res, rej) => {
			_readPool.query(query, (err, result) => {
				if (err) {
					return rej(err);
				}
				return res(result);
			});
		});
		return null, readQueryResult.rows;
	} catch (err) {
		console.error("Error: PGUtils.readQuery  failed with error: ", err);
		return err;
	}
}

/**
 * Utility function to write to the database.
 * @param {object} query
 * @returns {array, ERROR}
 */
PGUtils.writeQuery = async (query) => {
	if (process.env.DEBUG) console.debug("PGUtils::writeQuery: text: ", query.text);
	try {
		let writeQueryResult = await new Promise((res, rej) => {
			_writePool.query(query, (err, result) => {
				if (err) {
					return rej(err);
				}
				return res(result);
			});
		});
		return writeQueryResult.rows;
	} catch (err) {
		console.error("Error: PGUtils.writeQuery  failed with error: ", err);
		return null, err;
	}
}

/**
 * Utility function to get formatted query text.
 * @param {object} query
 * @param {array} values
 * @returns {string}
 */
PGUtils.getQueryFromTemplate = (query, values) => {
	return PGFormat(query, values);
}

/**
 * Function to close the DB gracefully
 */
process.on('cleanup_and_exit', async () => {
	await _writePool.end();
	await _readPool.end();
	process.exit(0);
});

module.exports = PGUtils;
