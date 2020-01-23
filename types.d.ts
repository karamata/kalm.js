/* Types ---------------------------------------------------------------------*/

interface EventHandler {
    (event?: any, event2?: any): void
}

interface EventEmitter {
    on(type: string, handler: EventHandler): void
    off(type: string, handler?: EventHandler): void
    emit(type: string, evt?: any, evt2?: any): void
    removeAllListeners(type?: string): void
    listenerCount(type?: string): number
}

interface ClientConfig {
    label?: string
    routine?: KalmRoutine
    json?: Boolean
    transport?: KalmTransport
    port?: number
    host?: string
    isServer?: boolean
    provider?: any
}

interface ProviderConfig {
    label?: string
    routine?: KalmRoutine
    json?: Boolean
    transport?: KalmTransport
    port?: number
    host?: string
}

type Remote = {
    host: string
    port: number
}

interface Provider extends EventEmitter {
    broadcast: (channel: string, message: Serializable) => void
    label: string
    stop: () => void
    connections: Client[]
}

interface Client extends EventEmitter {
    write: (channel: string, message: Serializable) => void
    destroy: () => void
    subscribe: (channel: string, handler: (body: any, frame: Frame) => any) => void
    unsubscribe: (channel: string, handler: (body: any, frame: Frame) => any) => void
    local: () => Remote
    remote: () => Remote
}

type Channel = {
    queue: Queue
    emitter: EventEmitter
}

type ChannelList = {
    [key: string]: Channel
}

type Serializable = Buffer | object | string | null

type UDPSocketHandle = {
    socket: any
    port: number
    host: string
}
type UDPClient = {
    client: Client
    timeout: NodeJS.Timeout
    data: Buffer[]
}
type UDPClientList = {
    [key: string]: UDPClient
}

type SocketHandle = NodeJS.Socket | UDPSocketHandle | WebSocket

interface KalmRoutine {
    (channel: string, params: any, channelEmitter: EventEmitter, clientEmitter: EventEmitter): Queue
}

interface KalmRoutineParams {
    hz: number
    maxBytes: number
    seed: number
}

interface Queue {
    add: (packet: Buffer) => void
    size: () => number
    flush: () => void
}

interface KalmTransport {
    (params: any, emitter: EventEmitter): Socket
}
interface Socket {
    bind: () => void
    remote: (handle: SocketHandle) => Remote
    connect: (handle?: SocketHandle) => SocketHandle
    stop: () => void
    send: (handle: SocketHandle, message: number[] | Buffer) => void
    disconnect: (handle: SocketHandle) => void
}

interface IPCConfig {
    socketTimeout?: number
    path?: string
}

interface TCPConfig {
    socketTimeout?: number
}

interface UDPConfig {
  type?: string
  localAddr?: string
  reuseAddr?: boolean
  socketTimeout?: number
  connectTimeout?: number
}

interface WSConfig {
    cert?: string
    key?: string
    secure?: boolean
}

interface WebRTCConfig {
    peers?: {
        candidate?: {
            candidate: string
            sdpMLineIndex: number
            sdpMid: string
        }
        type?: string
        sdp?: string
    }[]
}

type RawFrame = {
    frameId: number
    channel: string
    packets: Buffer[]
    payloadBytes: number
}

type Frame = {
    client: Client
    channel: string
    frame: {
      id: number
      messageIndex: number
      payloadBytes: number
      payloadMessages: number
    }
}

declare module 'kalm' {
    export const listen: (config: ProviderConfig) => Provider;
    export const connect: (config: ClientConfig) => Client;
    export const routines: {
        tick: (config: { hz: number, seed?: number }) => KalmRoutine
        dynamic: (config: { hz: number, maxPackets?: number }) => KalmRoutine
        realtime: () => KalmRoutine
    };
}
