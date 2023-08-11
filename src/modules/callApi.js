const INVOLVEMENT_API = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/';

export async function fetchBaseData() {
  try {
    const response = await fetch('https://api.tvmaze.com/shows/1/episodes');

    if (!response.ok) {
      throw new Error('Error fetching data from base API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching data from base API: ${error}`);
  }
}

export async function createApp() {
  try {
    const response = await fetch(`${INVOLVEMENT_API}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to create an app.');
    }

    const appId = await response.text();
    return appId;
  } catch (error) {
    console.error('Error creating app:', error);
    throw error;
  }
}

export async function fetchLikes(appId) {
  try {
    const response = await fetch(`${INVOLVEMENT_API}${appId}/likes/`);

    if (!response.ok) {
      throw new Error('Failed to fetch likes.');
    }

    const likesData = await response.json();
    return likesData;
  } catch (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }
}

export async function updateInteraction(appId, itemId) {
  try {
    const response = await fetch(`${INVOLVEMENT_API}${appId}/likes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: itemId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update interaction.');
    }

    return response.status === 201;
  } catch (error) {
    console.error('Error updating interaction:', error);
    throw error;
  }
}

export async function submitComment(appId, itemId, username, comment) {
  try {
    console.log('Submitting comment for item:', itemId);
    console.log('Comment data:', { username, comment });

    const response = await fetch(`${INVOLVEMENT_API}${appId}/comments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: itemId, username, comment }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit comment.');
    }
    console.log(`${INVOLVEMENT_API}${appId}/comments/`);
    return response.status === 201;
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
}

export async function fetchComments(appId, idx) {
  try {
    const response = await fetch(`${INVOLVEMENT_API}${appId}/comments?item_id=${idx}`);

    if (!response.ok) {
      throw new Error('Failed to fetch likes.');
    }

    const likesData = await response.json();
    return likesData;
  } catch (error) {
    console.error('Error fetching likes:', error);
    return error;
  }
}
