/* Requires ------------------------------------------------------------------*/

import { EventEmitter } from 'events';
import net from 'net';
import dgram from 'dgram';

/* Types ---------------------------------------------------------------------*/

export type ClientConfig = {
    label?: string
    routine?: Routine
    format?: Format
    transport?: Transport
    secretKey?: string
    port?: number
    host?: string
    isServer?: boolean
    provider?: any
}

export type ServerConfig = {
    providers: ClientConfig[]
    host?: string
}

export type ByteList = number[] | Buffer

export type Remote = {
    host: string
    port: number
}

export type Server = {
    providers: <U>(callbackfn: (value: Provider, index: number, array: Provider[]) => U, thisArg?: any) => U[]
    host: string
}

export interface Provider extends EventEmitter {
    broadcast: (channel: string, message: Serializable) => void
    label: string
    stop: () => void
    connections: Client[]
}

export interface Client extends EventEmitter {
    write: (channel: string, message: Serializable) => void
    destroy: () => void
    subscribe: (channel: string, handler: () => void) => void
    unsubscribe: (channel: string, handler: () => void) => void
    local: () => Remote
    remote: () => Remote
}

export type Channel = {
    queue: Queue
    emitter: EventEmitter
}

export type Serializable = Buffer | object | string | null

export type Routine = (channel: string, params: object, emitter: EventEmitter) => Queue
export interface Queue {
    add: (packet: ByteList) => void
    size: () => number
    flush: () => void
}

export type Format = (params: object, emitter: EventEmitter) => Serializer
export interface Serializer {
    encode: (message: Serializable) => ByteList
    decode: (payload: ByteList) => Serializable
}

export type Transport = (params: object, emitter: EventEmitter) => Socket
export interface Socket {
    bind: () => void
    remote: (handle: net.Socket | dgram.Socket) => Remote
    connect: () => net.Socket | dgram.Socket
    stop: () => void
    send: (handle: net.Socket | dgram.Socket, message: ByteList) => void
    disconnect: (handle: net.Socket | dgram.Socket) => void
}

export type RawFrame = {
    frameId: number
    channel: string
    packets: ByteList[]
    payloadBytes: number
}
