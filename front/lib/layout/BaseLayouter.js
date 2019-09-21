import {
  getMid
} from './LayoutUtil';


/**
 * A base connection layouter implementation
 * that layouts the connection by directly connecting
 * mid(source) + mid(target).
 */
export default function BaseLayouter() {}


/**
 * Return the new layouted waypoints for the given connection.
 *
 * The connection passed is still unchanged; you may figure out about
 * the new connection start / end via the layout hints provided.
 *
 * @param {djs.model.Connection} connection
 * @param {Object} [hints]
 * @param {Point} [hints.connectionStart]
 * @param {Point} [hints.connectionEnd]
 * @param {Point} [hints.source]
 * @param {Point} [hints.target]
 *
 * @return {Array<Point>} the layouted connection waypoints
 */
BaseLayouter.prototype.layoutConnection = function(connection, hints) {

  hints = hints || {};

  return [
    hints.connectionStart || getMid(hints.source || connection.source),
    hints.connectionEnd || getMid(hints.target || connection.target)
  ];
};
