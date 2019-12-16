export interface IKeyRing {
    name: string;
    createTime: string
}

export interface ICryptoKeys {
    name: string;
    primary: ICryptoKeyVersion;
    purpose:
        'CRYPTO_KEY_PURPOSE_UNSPECIFIED' |
        'ENCRYPT_DECRYPT' |
        'ASYMMETRIC_SIGN' |
        'ASYMMETRIC_DECRYPT';
    createTime: string;
    nextRotationTime: string;
    versionTemplate: {
        protectionLevel:
            'PROTECTION_LEVEL_UNSPECIFIED' |
            'SOFTWARE' |
            'HSM';// enum (ProtectionLevel),
        algorithm:
            'CRYPTO_KEY_VERSION_ALGORITHM_UNSPECIFIED' |
            'GOOGLE_SYMMETRIC_ENCRYPTION' |
            'RSA_SIGN_PSS_2048_SHA256' |
            'RSA_SIGN_PSS_3072_SHA256' |
            'RSA_SIGN_PSS_4096_SHA256' |
            'RSA_SIGN_PSS_4096_SHA512' |
            'RSA_SIGN_PKCS1_2048_SHA256' |
            'RSA_SIGN_PKCS1_3072_SHA256' |
            'RSA_SIGN_PKCS1_4096_SHA256' |
            'RSA_SIGN_PKCS1_4096_SHA512' |
            'RSA_DECRYPT_OAEP_2048_SHA256' |
            'RSA_DECRYPT_OAEP_3072_SHA256' |
            'RSA_DECRYPT_OAEP_4096_SHA256' |
            'RSA_DECRYPT_OAEP_4096_SHA512' |
            'EC_SIGN_P256_SHA256' |
            'EC_SIGN_P384_SHA384'; // enum (CryptoKeyVersionAlgorithm)
    }; // { object(CryptoKeyVersionTemplate) };
    labels: { [label: string]: string; };
    rotationPeriod: string;
}

export interface ICryptoKeyVersion {
    name: string;
    state: 
        'CRYPTO_KEY_VERSION_STATE_UNSPECIFIED' |
        'PENDING_GENERATION' |
        'ENABLED' |
        'DISABLED' |
        'DESTROYED' |
        'DESTROY_SCHEDULED';
    protectionLevel:
        'PROTECTION_LEVEL_UNSPECIFIED' |
        'SOFTWARE' |
        'HSM';
    algorithm:
        'CRYPTO_KEY_VERSION_ALGORITHM_UNSPECIFIED' |
        'GOOGLE_SYMMETRIC_ENCRYPTION' |
        'RSA_SIGN_PSS_2048_SHA256' |
        'RSA_SIGN_PSS_3072_SHA256' |
        'RSA_SIGN_PSS_4096_SHA256' |
        'RSA_SIGN_PSS_4096_SHA512' |
        'RSA_SIGN_PKCS1_2048_SHA256' |
        'RSA_SIGN_PKCS1_3072_SHA256' |
        'RSA_SIGN_PKCS1_4096_SHA256' |
        'RSA_SIGN_PKCS1_4096_SHA512' |
        'RSA_DECRYPT_OAEP_2048_SHA256' |
        'RSA_DECRYPT_OAEP_3072_SHA256' |
        'RSA_DECRYPT_OAEP_4096_SHA256' |
        'RSA_DECRYPT_OAEP_4096_SHA512' |
        'EC_SIGN_P256_SHA256' |
        'EC_SIGN_P384_SHA384'; // enum (CryptoKeyVersionAlgorithm)
    attestation: {
        format:
        'ATTESTATION_FORMAT_UNSPECIFIED' |
        'CAVIUM_V1_COMPRESSED' |
        'CAVIUM_V2_COMPRESSED';
        content: string;
    } | null;
    createTime: string;
    generateTime: string;
    destroyTime: string;
    destroyEventTime: string;
}
