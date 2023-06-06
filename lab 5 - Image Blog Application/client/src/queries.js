import { gql } from '@apollo/client';

const GET_UNSPLASH = gql`
    query unsplashImages($pageNum: Int!) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const GET_BINNED = gql`
    query binnedImages {
        binnedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const GET_POSTED = gql`
    query userPostedImages {
        userPostedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const UPLOAD_IMAGE = gql`
    mutation uploadImage($url: String!, $description: String, $posterName: String) {
        uploadImage(url: $url, description: $description, posterName: $posterName) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation deleteImage($id: String!) {
        deleteImage(id: $id) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const EDIT_IMAGE = gql`
    mutation updateImage(
        $id: String!
        $url: String
        $posterName: String
        $description: String
        $userPosted: Boolean
        $binned: Boolean
    ) {
        updateImage(
            id: $id
            url: $url
            posterName: $posterName
            description: $description
            userPosted: $userPosted
            binned: $binned
        ) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

let exported = {
    GET_UNSPLASH,
    GET_BINNED,
    GET_POSTED,
    UPLOAD_IMAGE,
    DELETE_IMAGE,
    EDIT_IMAGE,
};

export default exported;
