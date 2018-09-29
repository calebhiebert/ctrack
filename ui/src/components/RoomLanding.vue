<template>
  <div>
    <h1 class="h1 text-center">Example Room</h1>
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-header">
            <div class="card-title h5">
              Spectate
            </div>
            <div class="card-subtitle text-gray">
              Watch what's going on in this room (best for big screens)
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-header">
            <div class="card-title h5">
              Join
            </div>
            <div class="card-subtitle text-gray">
              Join this room as a character. You will have complete control over your character
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-header">
            <div class="card-title h5">
              Manage
            </div>
            <div class="card-subtitle text-gray">
              Manage this room. You will have complete control over all characters in this room. With the ability to add monsters
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/variables.scss';

.card {
	transition: all 0.25s;
}

.card:hover {
	cursor: pointer;
	background-color: $secondary-color;

	box-shadow: 0px 10px 60px -30px $dark-color;
}
</style>
