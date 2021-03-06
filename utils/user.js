
//adduser(id room user)
//remove(id)
//getuser(id)
//getuserlist(room)

class Users {
    constructor() {
        this.users = [];
    }

    adduser(id, name, room) {
        var user = { id, name, room };
        this.users.push(user);
        return user;
    }

    removeUserByName(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((userr) => userr.name !== user.name);
        }

        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        var user = this.users.filter((user) => user.id === id)[0];
        return user;
    }

    /*  getUserList(room)
      {
          var users = this.users.filter((user) =>  user.room === room);
          var namesArray = users.map((user) => user.name);
          return namesArray;
      }*/
    getRoomList() {
        var peeps = this.users.map((user) => user.room);
        var rooms = Array.from(new Set(peeps));

        return rooms;
    }
}

module.exports = { Users };