// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Interface {
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);

    function transfer(address _to, uint256 _value) external returns (bool);

    function approve(address _spender, uint256 _value) external returns (bool);

    function balanceOf(address _owner) external view returns (uint256);
}

contract RaffleContract {
    address public owner;
    mapping(address => uint256) public entryCount;
    address[] public players;
    address[] private playerSelector;
    bool public raffleStatus;
    uint256 public entryCost;
    IERC20Interface public tokenAddress;
    uint256 public totalEntries;
    address public lastWinner;

    event NewEntry(address player);
    event RaffleStarted();
    event RaffleEnd();
    event WinnerSelected(address winner);
    event EntryCostChanged(uint256 newCost);
    event BalanceWithdraw(uint256 amount);

    constructor(uint256 _entryCost) {
        owner = msg.sender;
        entryCost = _entryCost;
        raffleStatus = false;
        totalEntries = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call the function");
        _;
    }

    function startRaffle(IERC20Interface _tokenAddress) public onlyOwner {
        require(!raffleStatus, "Raffle is already started");
        require(address(_tokenAddress) != address(0), "The token is not valid");

        tokenAddress = _tokenAddress;
        raffleStatus = true;
        emit RaffleStarted();
    }

    function buyEntry(uint256 _numberOfEntries) public returns (bool) {
        require(raffleStatus, "Raffle is not Started");

        uint256 senderBalance = tokenAddress.balanceOf(msg.sender);
        require(
            senderBalance >= entryCost * _numberOfEntries,
            "Insufficient Balance"
        );

        bool success = tokenAddress.transferFrom(
            msg.sender,
            address(this),
            entryCost * _numberOfEntries
        );
        require(success, "Transfer Failed");

        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;

        if (!isPlayer(msg.sender)) {
            players.push(msg.sender);
        }

        for (uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }
        emit NewEntry((msg.sender));
        return true;
    }

    function isPlayer(address _player) public view returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == _player) {
                return true;
            }
        }
        return false;
    }

    function endRaffle() public onlyOwner {
        require(raffleStatus, "Raffle is not started");
        raffleStatus = false;
        emit RaffleEnd();
    }

    function selectWinner() public onlyOwner {
        require(!raffleStatus, "Raffle is stil running");
        require(playerSelector.length > 0, "No players in raffle");

        uint256 winnerIndex = random() % playerSelector.length;
        address winner = playerSelector[winnerIndex];
        lastWinner = winner;

        emit WinnerSelected(winner);

        resetEntryCounts();

        delete playerSelector;
        delete players;
        tokenAddress = IERC20Interface(address(0));
        totalEntries = 0;
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.prevrandao, block.number, players)
                )
            );
    }

    function resetEntryCounts() private {
        for (uint256 i = 0; i < players.length; i++) {
            entryCount[players[i]] = 0;
        }
    }

    function changeEntryCost(uint256 _newCost) public onlyOwner {
        require(!raffleStatus, "Raffle is still running");
        entryCost = _newCost;
        emit EntryCostChanged(_newCost);
    }

    function withdrawBalance() public onlyOwner {
        uint256 balanceAmount = tokenAddress.balanceOf(address(this));
        require(balanceAmount > 0, "No balance to withdraw");

        bool success = tokenAddress.transfer(msg.sender, balanceAmount);
        require(success, "Transfer Failed");

        emit BalanceWithdraw(balanceAmount);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function getBalance() public view returns (uint256) {
        return tokenAddress.balanceOf(address(this));
    }
}
