document.addEventListener('DOMContentLoaded', () => {
    const sixHourApiUrl = 'https://prices.runescape.wiki/api/v1/osrs/6h';
    const latestApiUrl = 'https://prices.runescape.wiki/api/v1/osrs/latest';
    const headers = new Headers({
        'User-Agent': 'Low Volume - @Batswish1742 on Discord'
    });

    const fetchSixHourData = fetch(sixHourApiUrl, { headers });
    const fetchLatestData = fetch(latestApiUrl, { headers });

    Promise.all([fetchSixHourData, fetchLatestData])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([sixHourData, latestData]) => processItems(sixHourData.data, latestData.data))
        .catch(error => console.error('Error fetching data:', error));
});

function processItems(sixHourData, latestData) {
    const itemList = document.getElementById('item-list');

    // Example thresholds for filtering low volume and high margins
    const minVolumeThreshold = 50;
    const maxVolumeThreshold = 1000;
    const marginThreshold = 50000;

    Object.keys(sixHourData).forEach(itemId => {
        const sixHourItem = sixHourData[itemId];
        const latestItem = latestData[itemId];

        if (sixHourItem && latestItem) {
            const volume = sixHourItem.highPriceVolume;
            const margin = latestItem.high - latestItem.low;

            if (volume >= minVolumeThreshold && volume < maxVolumeThreshold && margin > marginThreshold) {
                const itemElement = createItemElement(itemId, sixHourItem, latestItem);
                itemList.appendChild(itemElement);
            }
        }
    });
}

function createItemElement(itemId, sixHourItem, latestItem) {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';

    const itemName = document.createElement('div');
    itemName.className = 'item-name';
    itemName.textContent = `Item ID: ${itemId}`; // Replace with actual item name if available

    const itemVolume = document.createElement('div');
    itemVolume.textContent = `Volume: ${sixHourItem.highPriceVolume}`;

    const itemMargin = document.createElement('div');
    itemMargin.textContent = `Margin: ${latestItem.high - latestItem.low}`;

    itemElement.appendChild(itemName);
    itemElement.appendChild(itemVolume);
    itemElement.appendChild(itemMargin);

    return itemElement;
}
