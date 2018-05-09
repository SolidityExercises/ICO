# ICO task

## Requirements Level 1

Create an ICO Crowdsale smart contracts system. The abbreviation of the token should be LET, the name of the token should be LimeChain Exam Token and should have 18 decimal points.

The Crowdsale should be 30 days long (from an date of your choice). The default rate of exchange of tokens should be 1ETH = 100 LET.


## Requirements Level 2

During the first 7 days the rate should be 1ETH = 500 LET. If during these 7 days 10 ETH are raised the rate should go down to 1ETH = 300 LET.

During the second 7 days (7 to 15) the rate should be 1ETH = 200 LET and if the total ETH raised from the begining of the campaign reaches 30ETH the rate should go down to 1ETH = 150 ETH.

For the remainder of the Period the rate should be the default one.


## Requirements Level 3

The transfering (trading) of tokens should be disabled until the Crowdsale is over.


## Requirements Level 4

Create a way for the Crowdsale Admin to mint free tokens during the crowdsale. This is sometimes needed as rewards for people doing marketing for the ICO.

# LimeToken contract Application Binary Interface

`[ {"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"investmentAllowedAfter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_investmentAllowedAfter","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"} ]`

# LimeCrowdsale contract Application Binary Interface

`[ {"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalWeiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"secondPhaseEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"firstPhaseEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"saleStart","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"saleEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_weiAmount","type":"uint256"}],"name":"getTokenAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buyTokens","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_wallet","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensBought","type":"event"} ]`


