# Imgur API

This project was made for the sole purpose of getting img tags that can be used in html to show the images pesent in an imgur album. If you wish to use this repo you will need an imgur account. Don't worry it's completely free.

**Note:** This website automatically stores the last used Client ID in the browsers local storage and retrieves it when you revisit the site for ease of access.

**Note:** By default this repo will return the img tags with a `padding-bottom: 15px;`. This will create a padding, or to better understand, a gap of 15 pixels between the image and anything that is present at the bottom of the image.

## How to use it
To use this service you need:
- A [Client ID](#imgur-client-id) that is provided by Imgur when you register an app.
- The [Album ID](#imgur-album-id) of the album from which you want to retieve the images.

The process for obtainig/finding the above mentioned requirements has been written below.

### Imgur Client ID
The Client ID is used as authentication for the Imgur API.
To get your client ID you can go to this [link](https://api.imgur.com/oauth2/addclient) and register your app there.

**Note:** If you have a Client ID but have forgotten it or lost it you can find it [here](https://imgur.com/account/settings/apps).

While registering your app you can choose any of the options provided, however if you are creating the app only to use it for this repo then I reccomend you go with this:

![App Registration](https://i.imgur.com/sMWueBa.png)

After this enter your email id and that's it.
After clicking the submit button you will be redirected to a page that looks something like this:

![Client ID and Client Secret](https://i.imgur.com/ag7dSHe.png)

The Client ID provided there will be your Client ID. In this case we do not require the Client Secret.
Also don't try using the Client ID in the image provided, I have already deleted them.


### Imgur Album ID
The link for an imgur album will be something like this: `https://imgur.com/a/bg7wPeB` or `https://imgur.com/gallery/bg7wPeB`.

From this link copy the part that is after `imgur.com/a/` or `imgur.com/gallery/`, that is `bg7wPeB`. This is the **Album ID**.

---

## Additional Points
This repo also automatically copies the img tags onto your clipboard for ease of access. If by any chance it failed, the img tags are provided on the website and you can manually select them and copy them.
