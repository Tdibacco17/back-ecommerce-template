export interface EnviromentInterface {
    PORT: string | undefined,
    HOST: string | undefined,
    JWT_SECRET: string | undefined,
    JWT_ALGORITHM: string | undefined,
    JWT_EXPIRE: string | undefined,
    MONGODB_URI: string | undefined,
    MONGO_USERNAME: string | undefined,
    MONGO_PASSWORD: string | undefined,
    MONGO_COLLECTION: string | undefined,
}