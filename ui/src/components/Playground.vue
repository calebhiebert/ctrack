<template>
  <div>
    <div class="box">
      <div class="anim expand" style="background-color: black; width: 3rem; height: 3rem;"></div>
      <div class="popover popover-right">
        <button class="btn btn-primary">right popover</button>
        <div class="popover-container">
          <div class="card anim expand">
            <div class="card-header">
              ...
            </div>
            <div class="card-body">
              ...
            </div>
            <div class="card-footer">
              ...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.anim {
	display: flex;
	background: var(--contrast);
	//background-image: linear-gradient(to top, rgba(#fff,.3) 0%, rgba(#fff,0) 100%);
	position: absolute;
	top: 5%;
	left: 5%;
	width: 90%;
	height: 90%;
}

.box {
	position: relative;

	// width: 12rem;
	height: calc(16.66vw - 2rem);
	flex: 0 0 calc(16.66% - 1rem);
	margin: 0 1rem 1rem 0;
	perspective: 1200px;

	@media (max-width: 1000px) {
		height: calc(25vw - 2rem);
		flex: 0 0 calc(25% - 1rem);
	}
	@media (max-width: 700px) {
		height: calc(50vw - 2rem);
		flex: 0 0 calc(50% - 1rem);
	}
	overflow: hidden;
	&:hover {
		overflow: inherit;
	}
}

.expand {
	opacity: 0;
	animation: 500ms expand-out cubic-bezier(0, 0.8, 0.6, 1.8);
	animation-fill-mode: forwards;
	transition: 100ms opacity linear 400ms;
	transform: rotate(180deg);
	will-change: clip-path;
	.box:hover & {
		opacity: 1;
		animation: 500ms expand cubic-bezier(0, 0.8, 0.6, 1);
		animation-fill-mode: forwards;
		transition: 200ms opacity linear;
		transform: rotate(0deg);
	}
}

//animation-timing-function: cubic-bezier(.7, .3, 0, 1);
@keyframes expand {
	0% {
		clip-path: polygon(45% 45%, 85% 45%, 70% 70%, 45% 85%);
	}
	20% {
		clip-path: polygon(30% 30%, 70% 30%, 70% 70%, 30% 70%);
	}
	30% {
		clip-path: polygon(30% 30%, 80% 20%, 70% 70%, 30% 70%);
	}
	45% {
		clip-path: polygon(18% 18%, 100% 0, 80% 80%, 30% 70%);
	}
	55% {
		clip-path: polygon(0% 0%, 100% 0, 100% 100%, 20% 80%);
	}
	90% {
		clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0% 100%);
	}
	100% {
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
	}
}

@keyframes expand-out {
	0% {
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
	}
	20% {
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
	}
	30% {
		clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0% 100%);
	}
	40% {
		clip-path: polygon(0% 0%, 100% 0, 100% 100%, 20% 80%);
	}
	50% {
		clip-path: polygon(18% 18%, 100% 0, 80% 80%, 30% 70%);
	}
	70% {
		clip-path: polygon(20% 20%, 80% 20%, 70% 70%, 30% 70%);
	}
	80% {
		clip-path: polygon(30% 30%, 70% 30%, 70% 70%, 30% 70%);
	}
	100% {
		clip-path: polygon(30% 30%, 70% 30%, 70% 70%, 30% 70%);
	}
}
</style>

