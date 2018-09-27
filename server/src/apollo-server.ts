/**
 * Api server base. Sets up the basis for the entire server
 * Shamelessly copied from:
 * https://github.com/apollographql/apollo-server/blob/fa6c973f3685fceea905acf259824005e0e0ffe2/packages/apollo-server/src/index.ts
 */
import {
	ApolloServer as ApolloServerBase,
	Config,
	CorsOptions,
} from 'apollo-server-express';
import * as express from 'express';
import * as http from 'http';
import * as net from 'net';
export interface IServerInfo {
	address: string;
	family: string;
	url: string;
	subscriptionsUrl: string;
	port: number | string;
	subscriptionsPath: string;
	server: http.Server;
	app: express.Express;
}

export class APIServer extends ApolloServerBase {
	private _httpServer?: http.Server;

	public async listen(
		port: number,
		app: express.Express
	): Promise<IServerInfo> {
		this._httpServer = http.createServer(app);
		this.installSubscriptionHandlers(this._httpServer);

		await new Promise((resolve) => {
			if (this._httpServer) {
				this._httpServer.once('listening', resolve);
				this._httpServer.listen({ port });
			}
		});

		return this.createServerInfo(this._httpServer, this.subscriptionsPath);
	}

	public async stop() {
		if (this._httpServer) {
			// await new Promise((resolve) => this._httpServer.close(resolve));
			this._httpServer = undefined;
		}
		await super.stop();
	}

	private createServerInfo(
		server: http.Server,
		subscriptionsPath?: string
	): IServerInfo {
		const serverInfo: any = {
			...(server.address() as net.AddressInfo),
			server,
			subscriptionsPath,
		};

		// Convert IPs which mean "any address" (IPv4 or IPv6) into localhost
		// corresponding loopback ip. Note that the url field we're setting is
		// primarily for consumption by our test suite. If this heuristic is
		// wrong for your use case, explicitly specify a frontend host (in the
		// `frontends.host` field in your engine config, or in the `host`
		// option to ApolloServer.listen).
		let hostForUrl = serverInfo.address;
		if (serverInfo.address === '' || serverInfo.address === '::') {
			hostForUrl = 'localhost';
		}

		serverInfo.url = require('url').format({
			protocol: 'http',
			hostname: hostForUrl,
			port: serverInfo.port,
			pathname: this.graphqlPath,
		});

		serverInfo.subscriptionsUrl = require('url').format({
			protocol: 'ws',
			hostname: hostForUrl,
			port: serverInfo.port,
			slashes: true,
			pathname: subscriptionsPath,
		});

		return serverInfo;
	}
}
